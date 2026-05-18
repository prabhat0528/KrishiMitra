FROM python:3.10

WORKDIR /genAI

COPY requirements.txt ./

COPY . .



RUN pip install -r requirements.txt

EXPOSE 5001

CMD ["python","genAI.py"]

