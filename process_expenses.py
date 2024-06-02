# 일별 가계부 csv 파일을 월별 카테고리별 총합을 해서 csv 파일을 새로 만들어주는 코드.
"""
입력 csv 파일
날짜,idx,설명,구매처,구매처 종류,카테고리,금액
24. 1. 1.,1,아아,스타벅스,카페,외식,4500

출력 csv 파일
Month,Category,Amount
1,외식,109590
"""

import csv

with open('./expense2024.csv', 'r') as f, open('./my-app/public/data.csv', 'w', newline='') as f2:
    rdr = csv.reader(f)
    next(rdr)

    data = {}
    result = []


    cate_rank = {}
    cate_rank_sorted = {}

    for row in rdr:
        date = row[0]
        category = row[-2]
        amount = int(row[-1])

        month = int(date.split('. ')[1])
        category = category.replace('의류/잡화','의류잡화')
        
        data.setdefault(month, {})
        data[month].setdefault(category, 0)
        data[month][category] += amount

        cate_rank.setdefault(category, 0)
        cate_rank[category] += amount

    # 카테고리 전체 소비 금액 랭킹 (1~n월까지의 총 소비 금액 기준)
    cate_rank_sorted = dict(sorted(cate_rank.items(), key=lambda x:x[1], reverse=True))

    # 지금은 월별로 카테고리별 금액 내림차순으로 write했는데, 전체 금액 기준으로 내림차순으로 바꾸기. (6/2 완료)
    # 예를 들어 1월 a:60, b:80, c:40 / 2월 a:50, b:20, c:100이면
    # 총액은 a:110, b:100, c:140이니까 아래처럼.
    """
    1,c,40
    1,a,60
    1,b,80
    2,c,100
    2,a,50
    2,b,20
    """
    # 월별 카테고리별 금액 내림차순
    # sorted_data = {}
    # for i in range(1, month+1):
    #     print(i)
    #     sorted_data.setdefault(i, {})
    #     sorted_data[i] = dict(sorted(data[i].items(), key=lambda x:x[1], reverse=True))
    #     print(sorted_data[i])
    #     print()

    # 전체 카테고리별 금액 내림차순
    sorted_data = {}
    for i in range(1, month+1):
        sorted_data.setdefault(i, {})
        sorted_cate = sorted(data[i].keys(), key=lambda x:cate_rank_sorted[x], reverse=True)
        sorted_data[i] = {cate:data[i][cate] for cate in sorted_cate}
        print(i)
        print(sorted_cate)
        print(sorted_data[i])
        print()

    wr = csv.writer(f2)
    wr.writerow(['Month', 'Category', 'Amount'])
    for mon, value in sorted_data.items():
        for cate, won in value.items():
            wr.writerow([mon, cate, won])
