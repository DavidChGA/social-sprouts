import requests
import os
import json
import argparse

def parse_arguments():
    parser = argparse.ArgumentParser(description="Descargar pictogramas de ARASAAC y generar archivos JSON y TS.")
    parser.add_argument("keywords", nargs="+", help="Lista de palabras clave para buscar pictogramas")
    parser.add_argument("--language", default="es", help="Idioma para la búsqueda (por defecto: 'es')")
    parser.add_argument("--output-folder", default="img", help="Carpeta de salida para las imágenes")
    return parser.parse_args()

def download_pictograms_and_generate_files(keyword, img_folder, language, categories_data, ts_image_map):
    keyword_folder = os.path.join(img_folder, keyword)
    os.makedirs(keyword_folder, exist_ok=True)

    search_url = f"https://api.arasaac.org/api/pictograms/{language}/search/{keyword}"
    response = requests.get(search_url)
    
    if response.status_code != 200:
        print(f"Error al obtener datos para '{keyword}'. Código: {response.status_code}")
        return

    data = response.json()

    filtered_pictograms = [
        p for p in data
        if "tags" in p and isinstance(p["tags"], list) and "core vocabulary" in p["tags"]
        and "keywords" in p and isinstance(p["keywords"], list)
        and not any(keyword.lower() == kw["keyword"].lower() for kw in p["keywords"])
    ][:20]

    pictograms_info = []

    for pictogram in filtered_pictograms:
        pictogram_id = pictogram["_id"]
        image_url = f"https://api.arasaac.org/api/pictograms/{pictogram_id}?download=true"
        
        first_keyword = pictogram["keywords"][0]["keyword"].split()[0].replace(" ", "_") if pictogram["keywords"] else f"pictograma_{pictogram_id}"
        file_name = f"{first_keyword}.png"
        file_path = os.path.join(keyword_folder, file_name)
        
        img_data = requests.get(image_url).content
        with open(file_path, "wb") as handler:
            handler.write(img_data)
        
        print(f"Pictograma '{first_keyword}' guardado en: {file_path}")

        category = keyword.capitalize()
        ts_image_map.setdefault(category, []).append(first_keyword.upper())
        
        pictograms_info.append({"id": len(pictograms_info) + 1, "name": first_keyword.upper()})
    
    if pictograms_info:
        categories_data[keyword.capitalize()] = pictograms_info
    
    if not filtered_pictograms:
        print(f"No se encontraron pictogramas válidos para '{keyword}'.")

def main():
    args = parse_arguments()
    script_directory = os.path.dirname(os.path.abspath(__file__))  
    project_directory = os.path.abspath(os.path.join(script_directory, ".."))  # Subir un nivel
    assets_folder = os.path.join(project_directory, "src", "assets")  
    img_folder = os.path.join(assets_folder, "img")  # Carpeta donde se guardarán las imágenes

    os.makedirs(img_folder, exist_ok=True)

    categories_data = {}
    ts_image_map = {}

    for keyword in args.keywords:
        print(f"Buscando y descargando pictogramas para '{keyword}'...")
        download_pictograms_and_generate_files(keyword, img_folder, args.language, categories_data, ts_image_map)
    
    json_file_path = os.path.join(assets_folder, "vocabulary-config.json")
    with open(json_file_path, "w", encoding="utf-8") as json_file:
        json.dump({"categorias": categories_data, "defaultConfig": {"imagesToShow": 3, "rounds": 3}}, json_file, ensure_ascii=False, indent=4)
    print(f"Archivo JSON generado: {json_file_path}")

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

if __name__ == "__main__":
    main()
