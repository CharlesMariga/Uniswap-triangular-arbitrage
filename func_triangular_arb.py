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


# Calculate surface arb potential
def calc_triangular_arbs_surface_rate(t_pair):
    # Set variables
    min_surface_rate = 1.5
    surface_dict = {}
    pool_contract_2 = ""
    pool_contract_3 = ""
    pool_direction_trade_1 = ""
    pool_direction_trade_2 = ""
    pool_direction_trade_3 = ""

    # Calculate forward and reverse rates
    direction_list = ["forward", "reverse"]

    for direction in direction_list:
        # SEt pair info
        a_base = t_pair["a_base"]
        a_quote = t_pair["a_quote"]
        b_base = t_pair["b_base"]
        b_quote = t_pair["c_quote"]
        c_base = t_pair["c_base"]
        c_quote = t_pair["c_quote"]

        # Set price info
        a_token0_price = float(t_pair["a_token0_price"])
        a_token1_price = float(t_pair["a_token1_price"])
        b_token0_price = float(t_pair["b_token0_price"])
        b_token1_price = float(t_pair["b_token1_price"])
        c_token0_price = float(t_pair["c_token0_price"])
        c_token1_price = float(t_pair["c_token1_price"])

        # Set address info
        a_contract = t_pair["a_contract"]
        b_contract = t_pair["b_contract"]
        c_contract = t_pair["c_contract"]

        # Set variables
        starting_amount = 1
        acquired_coin_t2 = 0
        acquired_coin_t3 = 0
        calculated = 0

        swap_1 = 0
        swap_2 = 0
        swap_3 = 0
        swap_1_rate = 0
        swap_2_rate = 0
        swap_3_rate = 0

        # Assume starting with a_base is forward
        if direction == "forward":
            swap_1 = a_base
            swap_2 = a_quote
            swap_1_rate = a_token1_price
            pool_direction_trade_1 = "base_to_quote"

        # Assume start with a_quote if reverse
        if direction == "reverse":
            swap_1 = a_quote
            swap_2 = a_base
            swap_1_rate = a_token0_price
            pool_direction_trade_1 = "quote_to_base"

        # Place first trade
        pool_conract_1 = a_contract
        acquired_coin_t1 = starting_amount * swap_1_rate

        # Forward: check if a_quote (acquired coin) matches b_quote
        if direction == "forward":
            if a_quote == b_quote and calculated == 0:
                swap_2_rate = b_token0_price
                acquired_coin_t2 = acquired_coin_t1 * swap_2_rate
                pool_direction_trade_2 = "quote_to_base"
                pool_contract_2 = b_contract

                # Forward: check if b_base (acquired coin) matches c_base
                if b_base == c_base:
                    swap_3 == c_base
                    swap_3_rate = c_token1_price
                    pool_direction_trade_3 = "base_to_quote"
