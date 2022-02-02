# https://thegraph.com/hosted-service/subgraph/uniswap/uniswap-v3
import time
import requests
import json
import func_triangular_arb

""" GET GRAPHQL MIN PRICES FOR UNISWAP """


def retrieve_uniswap_information():
    url = "https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3"
    query = """
        query {
            pools(orderBy: totalValueLockedETH, orderDirection: desc, first:500) {
                id
                token0Price
                token1Price
                feeTier
                token0 {id symbol name decimals}
                token1 {id symbol name decimals}
            }
        }
    """
    req = requests.post(url, json={'query': query})
    json_dict = json.loads(req.text)
    return json_dict


if __name__ == "__main__":
    while True:
        pairs = retrieve_uniswap_information()["data"]["pools"]
        structured_pairs = func_triangular_arb.structure_trading_pairs(
            pairs, limit=500)

        surface_rates_list = []
        for t_pair in structured_pairs:
            surface_rate = func_triangular_arb.calc_triangular_arbs_surface_rate(
                t_pair, min_rate=1.5)

            if len(surface_rate) > 0:
                surface_rates_list.append(surface_rate)

        # Save to json file
        with open("uniswap_surface_rates.json", "w") as fp:
            json.dump(surface_rates_list, fp)
            print("File saved.")

        time.sleep(60)
