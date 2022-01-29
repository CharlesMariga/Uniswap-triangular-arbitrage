# Structure trading pair groups
def structure_trading_pairs(pairs, limit=200):
    remove_duplicate_list = []
    triangular_pairs_list = []
    pairs_list = pairs[:limit]

    # Loop through each coin to find potential matches
    for pair_a in pairs_list:
        # Get first pair (A)
        a_base = pair_a["token0"]["symbol"]
        a_quote = pair_a["token1"]["symbol"]
        a_pair = a_base + "_" + a_quote
        a_token0_id = pair_a["token0"]["id"]
        a_token1_id = pair_a["token1"]["id"]
        a_contract = pair_a["id"]
        a_token0_decimals = pair_a["token0"]["decimals"]
        a_token1_decimals = pair_a["token1"]["decimals"]
        a_token0_price = pair_a["token0Price"]
        a_token1_price = pair_a["token1Price"]

        a_pair_box = [a_base, a_quote]

        # Get first pair (B)
        for pair_b in pairs_list:
            b_base = pair_b["token0"]["symbol"]
            b_quote = pair_b["token1"]["symbol"]
            b_pair = b_base + "_" + b_quote
            b_token0_id = pair_b["token0"]["id"]
            b_token1_id = pair_b["token1"]["id"]
            b_contract = pair_b["id"]
            b_token0_decimals = pair_b["token0"]["decimals"]
            b_token1_decimals = pair_b["token1"]["decimals"]
            b_token0_price = pair_b["token0Price"]
            b_token1_price = pair_b["token1Price"]

            # Get first pair (C)
            if b_base in a_pair_box or b_quote in a_pair_box:
                if a_pair != b_pair:
                    for pair_c in pairs_list:
                        c_base = pair_c["token0"]["symbol"]
                        c_quote = pair_c["token1"]["symbol"]
                        c_pair = c_base + "_" + c_quote
                        c_token0_id = pair_c["token0"]["id"]
                        c_token1_id = pair_c["token1"]["id"]
                        c_contract = pair_c["id"]
                        c_token0_decimals = pair_c["token0"]["decimals"]
                        c_token1_decimals = pair_c["token1"]["decimals"]
                        c_token0_price = pair_c["token0Price"]
                        c_token1_price = pair_c["token1Price"]

                        if c_pair != a_pair and c_pair != b_pair:
                            combine_all = [a_pair, b_pair, c_pair]
                            pair_box = [a_base, a_quote, b_base,
                                        b_quote, c_base, c_quote]

                            counts_c_base = 0
                            counts_c_quote = 0
                            for i in pair_box:
                                if i == c_base:
                                    counts_c_base += 1
                                if i == c_quote:
                                    counts_c_quote += 1

                            if counts_c_base == 2 and counts_c_quote == 2 and c_base != c_quote:
                                combined = a_pair + "," + b_pair + "," + c_pair
                                unique_string = "".join(sorted(combined))

                                if unique_string not in remove_duplicate_list:
                                    output_dict = {
                                        'a_pair': a_pair,
                                        'a_base': a_base,
                                        'a_quote': a_quote,
                                        'b_pair': a_pair,
                                        'b_base': b_base,
                                        'b_quote': b_quote,
                                        'c_pair': c_pair,
                                        'c_base': c_base,
                                        'c_quote': c_quote,
                                        'combined': combined,
                                        'a_token0_id': a_token0_id,
                                        'a_token1_id': a_token1_id,
                                        'b_token0_id': b_token0_id,
                                        'b_token1_id': b_token1_id,
                                        'c_token0_id': c_token0_id,
                                        'c_token1_id': c_token1_id,
                                        'a_contract': a_contract,
                                        'b_contract': b_contract,
                                        'c_contract': c_contract,
                                        'a_token0_decimals': a_token0_decimals,
                                        'a_token1_decimals': a_token1_decimals,
                                        'b_token0_decimals': b_token0_decimals,
                                        'b_token1_decimals': b_token1_decimals,
                                        'c_token0_decimals': c_token0_decimals,
                                        'c_token1_decimals': c_token1_decimals,
                                        'a_token0_price': a_token0_price,
                                        'a_token1_price': a_token1_price,
                                        'b_token0_price': b_token0_price,
                                        'b_token1_price': b_token1_price,
                                        'c_token0_price': c_token0_price,
                                        'c_token1_price': c_token1_price,
                                    }

                                    triangular_pairs_list.append(output_dict)
                                    remove_duplicate_list.append(unique_string)

    return triangular_pairs_list
