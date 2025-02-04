import sys
import os
import pandas as pd
import numpy as np
from faker import Faker

fake = Faker()
def generate_columns(project_description):
    words = project_description.lower().split() 
    columns = ["_".join(words) + "_id"]
    columns += words 
    columns += ["created_at"] 
    return list(set(columns)) 

def generate_dataset(project_description, num_rows=100):
    columns = generate_columns(project_description)
    data = []
    for _ in range(num_rows):
        row = {col: fake.random_int(1, 100) if "id" in col else fake.word() for col in columns}
        row["created_at"] = fake.date_time_this_year().strftime("%Y-%m-%d %H:%M:%S")
        data.append(row)
    df = pd.DataFrame(data)

    public_folder = "public"
    os.makedirs(public_folder, exist_ok=True)

    # Save CSV file
    file_name = "_".join(project_description.lower().split()) + ".csv"
    file_path = os.path.join(public_folder, file_name)
    df.to_csv(file_path, index=False)

    return file_path

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Error: Please provide a project description.")
        sys.exit(1)
    project_description = sys.argv[1]
    dataset_path = generate_dataset(project_description)
    print(dataset_path)
