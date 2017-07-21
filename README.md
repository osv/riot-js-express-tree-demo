Express, RiotJs(used "Observable" pattern)

- Create edit delate companies.
- Show companies tree
- Fields: Names, estimated earnings
- Show total earning per each company including childs:

| `Company 1`        | 10k | 35k |
| `- Company 1_1`    | 5k  | 10k |
| `-- Company 1_1_1` | 5k  |     |
| `- Company 1_2`    | 15k |     |

- Nesting level is not limited
- Companies is not limited
- No pagination

## Run demo

```bash
# Install npm dependencies
npm run install
# Start mongo instance. For example using docker:
docker run -itd -p 127.0.0.1:27017:27017 --name Mongo -d mongo  
# Export `MONGODB_URI`
export MONGODB_URI=mongodb://localhost:27017/tree-demo
# (Optional). Generate fake data.
npm run init-db
# Start app and go to http://localhost:3000
npm run start
```
