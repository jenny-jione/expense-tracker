import numbers_parser
import pandas as pd

def convert_numbers_to_csv(numbers_file, csv_file):
    # Numbers 파일 읽기
    doc = numbers_parser.Document(numbers_file)
    
    # 첫 번째 시트와 테이블 가져오기
    sheet = doc.sheets[0]
    table = sheet.tables[0]
    
    # 데이터를 판다스 데이터프레임으로 변환
    data = table.rows(values_only=True)
    df = pd.DataFrame(data)

    # 데이터프레임의 열 이름 출력
    print("DataFrame Columns:", df.columns)

    # 데이터 출력
    print("Data:")
    print(df)
    
    # 첫 번째 행을 열 이름으로 사용하여 데이터프레임 생성
    df = pd.DataFrame(data[1:], columns=data[0])
    
    # 데이터프레임의 열 이름 출력
    print("DataFrame Columns after setting header:", df.columns)

    # 필요한 열을 정수형으로 변환 (예: '인덱스'와 '금액' 열이 첫 번째와 두 번째 열이라고 가정)
    int_columns = ['idx', '금액']
    for col in int_columns:
        df[col] = df[col].astype('Int64')  # Int64를 사용하여 결측값도 지원

    # 날짜 형식을 yyyy.mm.dd로 변환 (예: '날짜' 열이 있다고 가정)
    date_column = '날짜'  # 실제 열 이름 확인 후 수정
    if date_column in df.columns:
        df[date_column] = pd.to_datetime(df[date_column]).dt.strftime('%Y.%m.%d')
    

    # 데이터프레임을 CSV 파일로 저장
    df.to_csv(csv_file, index=False, header=True)

# 사용 예시
numbers_file = 'expense2024numbers.numbers'
csv_file = 'expense2024.csv'
convert_numbers_to_csv(numbers_file, csv_file)
