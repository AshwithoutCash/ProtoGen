from fastapi import FastAPI

app = FastAPI()

@app.get("/")
async def techniques():
    return {
        "techniques": [
            {"value": "PCR", "label": "PCR"},
            {"value": "qPCR", "label": "qPCR"},
            {"value": "Gibson Assembly", "label": "Gibson Assembly"},
            {"value": "Miniprep", "label": "Miniprep"},
            {"value": "Gel Electrophoresis", "label": "Gel Electrophoresis"}
        ]
    }
