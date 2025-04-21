import requests
import os
import json
import argparse

# Clave API de VoiceRSS (reemplaza con tu clave real)
VOICERSS_API_KEY = 'API_KEY'

# Argumentos de la petición a la API
def parse_arguments():
    parser = argparse.ArgumentParser(description="Descarga de imágenes y sonidos y generación automática de ficheros de configuración para minijuego de Vocabulario")
    parser.add_argument("keywords", nargs="+", help="Lista de palabras clave para buscar pictogramas y generar sonidos")
    parser.add_argument("--language", default="es", help="Idioma para la búsqueda (por defecto: 'es')")
    parser.add_argument("--num", type=int, default=20, help="Número de pictogramas a descargar por palabra clave (por defecto: 20)")
    return parser.parse_args()

def download_pictograms_and_generate_files(keyword, img_folder, sound_folder, language, num, categories_data, ts_image_map, ts_sound_map):
    category_folder_img = os.path.join(img_folder, keyword)
    category_folder_sound = os.path.join(sound_folder, keyword)

    #Genera carpetas concretas para la categoria/palabra clave
    os.makedirs(category_folder_img, exist_ok=True)
    os.makedirs(category_folder_sound, exist_ok=True)

    # Se busca cada palabra clave en la API de ARASAAC.
    search_url = f"https://api.arasaac.org/api/pictograms/{language}/search/{keyword}"
    response = requests.get(search_url)
    
    if response.status_code != 200:
        print(f"Error al obtener datos para '{keyword}'. Código: {response.status_code}")
        return

    data = response.json()

    #Se descargan los primeros num pictogramas no genéricos y considerados parte del vocabulario básico y se almacenan en la carpeta de salida.
    filtered_pictograms = [
        p for p in data
        if "tags" in p and isinstance(p["tags"], list) and "core vocabulary" in p["tags"]
        and "keywords" in p and isinstance(p["keywords"], list)
        and not any(keyword.lower() == kw["keyword"].lower() for kw in p["keywords"])
    ][:num]

    pictograms_info = []

    for pictogram in filtered_pictograms:
        pictogram_id = pictogram["_id"]
        image_url = f"https://api.arasaac.org/api/pictograms/{pictogram_id}?download=true"
        
        first_keyword = pictogram["keywords"][0]["keyword"].split()[0].replace(" ", "_") if pictogram["keywords"] else f"pictograma_{pictogram_id}"
        file_name_img = f"{first_keyword}.png"
        file_path_img = os.path.join(category_folder_img, file_name_img)
      
        img_data = requests.get(image_url).content
        with open(file_path_img, "wb") as handler:
            handler.write(img_data)
        
        print(f"Pictograma '{first_keyword}' guardado en: {file_path_img}")

        category = keyword.capitalize()
        ts_image_map.setdefault(category, []).append(first_keyword.upper())
        
        pictograms_info.append({"id": len(pictograms_info) + 1, "name": first_keyword.upper()})

        # Descargar sonido asociado
        sound_file = f"{first_keyword}.mp3"
        sound_path = os.path.join(category_folder_sound, sound_file)
        download_sound(first_keyword, sound_path)

        ts_sound_map.setdefault(category, []).append(first_keyword.upper())

    if pictograms_info:
        categories_data[keyword.capitalize()] = pictograms_info
    
    if not filtered_pictograms:
        print(f"No se encontraron pictogramas válidos para '{keyword}'.")

def download_sound(word, sound_path):
    """Descarga un archivo de audio desde la API de VoiceRSS"""
    url = f"https://api.voicerss.org/?key={VOICERSS_API_KEY}&hl=es-es&v=Diego&src={word}&c=MP3"
    response = requests.get(url)

    if response.status_code == 200:
        with open(sound_path, "wb") as f:
            f.write(response.content)
        print(f"Audio '{word}.mp3' guardado en: {sound_path}")
    else:
        print(f"Error al descargar el audio para '{word}'. Código: {response.status_code}")

def main():
    args = parse_arguments()
    script_directory = os.path.dirname(os.path.abspath(__file__))  
    project_directory = os.path.abspath(os.path.join(script_directory, ".."))
    assets_folder = os.path.join(project_directory, "src", "assets")  
    img_folder = os.path.join(assets_folder, "img")
    sound_folder = os.path.join(assets_folder, "sounds")

    #Genera la carpeta de imagenes si esta no existe
    os.makedirs(img_folder, exist_ok=True)
    os.makedirs(sound_folder, exist_ok=True)

    categories_data = {}
    ts_image_map = {}
    ts_sound_map = {}

    for keyword in args.keywords:
        print(f"Buscando y descargando pictogramas y sonidos para '{keyword}'...")
        download_pictograms_and_generate_files(keyword, img_folder, sound_folder, args.language, args.num, categories_data, ts_image_map, ts_sound_map)
    
    # Archivo vocabulary-config.json con la información de las categorías y pictogramas.
    json_file_path = os.path.join(assets_folder, "vocabulary-config.json")
    with open(json_file_path, "w", encoding="utf-8") as json_file:
        json.dump({"categorias": categories_data, "defaultConfig": {"imagesToShow": 3, "rounds": 3}}, json_file, ensure_ascii=False, indent=4)
    print(f"Archivo JSON generado: {json_file_path}")

    # Archivo imageMap.ts con la correspondencia entre pictogramas y su ubicación en el proyecto
    ts_file_path = os.path.join(assets_folder, "imageMap.ts")
    with open(ts_file_path, "w", encoding="utf-8") as ts_file:
        ts_content = 'const imageMap: Record<string, any> = {\n'
        for category, pictograms in ts_image_map.items():
            ts_content += f"  // {category.upper()}\n"
            for pictogram in pictograms:
                ts_content += f'  "{pictogram}": require("../assets/img/{category.lower()}/{pictogram.lower()}.png"),\n'
        ts_content += '};\n\nexport default imageMap;'
        ts_file.write(ts_content)
    print(f"Archivo TypeScript generado: {ts_file_path}")

    # Archivo soundMap.ts con la correspondencia entre sonidos y su ubicación en el proyecto
    ts_sound_path = os.path.join(assets_folder, "soundMap.ts")
    with open(ts_sound_path, "w", encoding="utf-8") as ts_sound_file:
        ts_sound_content = 'const soundMap: Record<string, any> = {\n'
        for category, words in ts_sound_map.items():
            ts_sound_content += f"  // {category.upper()}\n"
            for word in words:
                ts_sound_content += f'  "{word}": require("../assets/sounds/{category.lower()}/{word.lower()}.mp3"),\n'
        ts_sound_content += '};\n\nexport default soundMap;'
        ts_sound_file.write(ts_sound_content)
    print(f"Archivo TypeScript generado: {ts_sound_path}")

if __name__ == "__main__":
    main()
