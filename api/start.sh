#!/bin/bash

# Start the FastAPI server with uvicorn
uvicorn main:app --host 0.0.0.0 --port 8000 --reload