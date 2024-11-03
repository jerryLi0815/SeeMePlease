#!/bin/bash
apt-get update && apt-get install -y ffmpeg
mv /usr/bin/ffmpeg /usr/local/bin/ffmpeg
pip install --ignore-installed -r /workspace/requirements.txt
nohup python /workspace/flask_call.py &
jupyter-notebook --no-browser --ip=0.0.0.0 --port=8888 --allow-root --NotebookApp.token='' --NotebookApp.password='' --NotebookApp.allow_origin='*'
