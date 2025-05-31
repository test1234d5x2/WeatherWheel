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

            # This check will now specifically look for your provided headers
            required_columns = ["city", "lat", "lng", "country", "iso2", "population", "capital"]
            if not all(col in csv_reader.fieldnames for col in required_columns):
                print("Error: Missing one or more required columns in CSV.")
                print(f"Expected: {required_columns}")
                print(f"Found: {csv_reader.fieldnames}")
                return

            for row in csv_reader:
                # Filter for primary capitals if requested
                if filter_capitals_only and row.get('capital') != 'primary':
                    continue

                city_entry = {
                    "name": row.get('city'),
                    "lat": float(row.get('lat', 0.0)),
                    "lon": float(row.get('lng', 0.0)),
                    "country": row.get('country'),
                    "iso2": row.get('iso2'),
                    "population": int(float(row.get('population', 0) or 0)), # Handle empty string population safely
                    "capital_type": row.get('capital'),
                    "id": row.get('id') # Added 'id' since it's in your headers
                }
                data.append(city_entry)

        with open(json_filepath, mode='w', encoding='utf-8') as json_file:
            json.dump(data, json_file, indent=2, ensure_ascii=False)

        print(f"Successfully converted '{csv_filepath}' to '{json_filepath}'")
        print(f"Found {len(data)} cities (filtered for primary capitals: {filter_capitals_only})")

    except FileNotFoundError:
        print(f"Error: The file '{csv_filepath}' was not found.")
    except KeyError as e:
        print(f"Error: Missing expected column in CSV: {e}. This should not happen if headers match.")
    except ValueError as e:
        print(f"Error converting data type: {e}. Check numeric columns like 'lat', 'lng', 'population'.")
    except Exception as e:
        print(f"An unexpected error occurred: {e}")

if __name__ == "__main__":
    csv_file = 'worldcities.csv'
    filter_primary_capitals = True 
    output_json_file = 'capital_cities.json' if filter_primary_capitals else 'all_world_cities.json'
    convert_csv_to_json(csv_file, output_json_file, filter_primary_capitals)