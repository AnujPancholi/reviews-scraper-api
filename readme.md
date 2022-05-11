## Reviews Scraper API

An API to scrape reviews on products from https://www.tigerdirect.com/applications/SearchTools/item-details.asp.

- The URL must have the `EdpNo` param, else it won't lead to a specific product's page.
- It'll only scrape from the first page of reviews; it disregards pagination.

### Starting up

`docker-compose up`

### Sample Request

```
curl --location --request POST 'http://127.0.0.1:3001/api/v0.1/scraper/scrape' \
--header 'Content-Type: application/json' \
--data-raw '{
    "url": "https://www.tigerdirect.com/applications/SearchTools/item-details.asp?EdpNo=640254&CatId=3"
}'
```
