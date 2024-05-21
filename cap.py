# 헤더 각 열 맨 앞글자를 대문자->소문자로 바꾸는 코드

header = 'Date,Transaction ID,Description,Store,Food Expense Type,Category,Amount'
header = header.lower()
result = header.replace(' ', '_')
print(result)