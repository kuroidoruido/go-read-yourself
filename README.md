# Go Read Yourself

A simple news sharing tool with compilation into a single markdown file

## How to run it

Create a data directory.

Create a `config.json` in the data directory:

```JSON
{
  "title": "Go Read Yourself",
  "user": {
    "salt": "ChangeThisStringWithARandomOne"
  },
  "card": {
    "dateFormat": "dd/MM/yyyy à HH:mm"
  },
  "compile": {
    "byTags": ["Dev", "Video game", "Misc"],
    "defaultGroupName": "Misc"
  }
}
```

Create a `news.json` in the data directory:

```JSON
{
    "news": []
}
```

Create a `users.json` in the data directory:

```JSON
{
    "admin@example.com": {
        "password": "hash",
        "name": "Admin"
    }
}
```

> When you will have run your Go Read Yourself instance, try to connect as admin by going to http://localhost:3000/admin and then go into the logs.
> You should see a log like: "hashed password that will be checked <hash>"
> Copy this hash and paste it in the `users.json`, replacing the `password` field of your user.

### ... with Docker

Run the container with: 

```Bash
docker run --name go-read-yourself -h go-read-yourself \
	--restart=always \
	--security-opt="no-new-privileges:true" \
	-v /path/to/go-read-yourself/data:/app/data:rw \
	-p 3000:3000 \
	-d anthonypena/go-read-yourself:latest
```

### ... by building it yourself

```Bash
git clone https://github.com/kuroidoruido/go-read-yourself.git
cd go-read-yourself
npm ci
npm run build
HOST=0.0.0.0 PORT=3000 node ./dist/server/entry.mjs
```

> Note: in this configuration, the data directory should be in the execution directory, so if you run it from the cloned directory, it will use the example data.

## Development

- Default user : admin@example.com / P@ssw0rd