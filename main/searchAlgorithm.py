"""
    Выведение наиболее похожих на поисковой запрос объектов БД.
"""
import Levenshtein


def search_same(name_request, projects):
    search_rate = 50
    tmp = []
    id = []
    [tmp.append([i.id, (Levenshtein.distance(i.name, name_request) / len(i.name) * 100)]) for i in projects]
    tmp.sort(key = lambda x: x[1])
    [id.append(i[0]) for i in tmp if i[1] < search_rate]
    return id
