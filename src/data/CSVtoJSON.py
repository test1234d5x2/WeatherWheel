import csv
import json
import os

def convert_csv_to_json(
    csv_filepath,
    json_filepath="capital_cities.json",
    filter_capitals_only=True
):
    data = []

    if not os.path.exists(csv_filepath):
        print(f"Error: CSV file not found at '{csv_filepath}'")
        return

    try:
        with open(csv_filepath, mode='r', encoding='utf-8') as csv_file:
            csv_reader = csv.DictReader(csv_file)

            required_columns = ["city", "lat", "lng", "country", "iso2", "population", "capital"]
            if not all(col in csv_reader.fieldnames for col in required_columns):
                print("Error: Missing one or more required columns in CSV.")
                print(f"Expected: {required_columns}")
                print(f"Found: {csv_reader.fieldnames}")
                return

            for row in csv_reader:
                if filter_capitals_only and row.get('capital') != 'primary':
                    continue

                city_entry = {
                    "name": row.get('city'),
                    "lat": float(row.get('lat', 0.0)),
                    "lon": float(row.get('lng', 0.0)),
                    "country": row.get('country'),
                    "iso2": row.get('iso2'),
                    "population": int(float(row.get('population', 0) or 0)),
                    "capital_type": row.get('capital'),
                    "id": row.get('id')
                }
                data.append(city_entry)

        with open(json_filepath, mode='w', encoding='utf-8') as json_file:
            json.dump(data, json_file, indent=2, ensure_ascii=False)

        print(f"Successfully converted '{csv_filepath}' to '{json_filepath}'")
        print(f"Found {len(data)} cities (filtered for primary capitals: {filter_capitals_only})")

    except Exception as e:
        print(f"An unexpected error occurred: {e}")

if __name__ == "__main__":
    csv_file = 'worldcities.csv'
    filter_primary_capitals = True 
    output_json_file = 'capital_cities.json' if filter_primary_capitals else 'all_world_cities.json'
    convert_csv_to_json(csv_file, output_json_file, filter_primary_capitals)