def flatten_list(list_to_flatten):
    result = []
    for sub_list in list_to_flatten:
        result.extend(sub_list)
    return result
