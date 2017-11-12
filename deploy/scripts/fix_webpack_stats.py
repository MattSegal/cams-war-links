"""
webpack-stats.json uses the absolute path of the webpack assets to locate them,
so we need to change the filepaths in the JSON to those on the target webserver
"""
import json
import sys

FILE_PATH = sys.argv[1]
DEPLOY_DIR = sys.argv[2]

with open(FILE_PATH,"r") as f:
    stats = json.load(f)

if stats["status"] != "done":
    raise Exception(stats)

for idx in range(len(stats["chunks"]["main"])):
    file_name = stats["chunks"]["main"][idx]["path"].split("/")[-1]
    stats["chunks"]["main"][idx]["path"] = "{}/assets/{}".format(DEPLOY_DIR, file_name)

with open(FILE_PATH,"w") as f:
    json.dump(stats,f)