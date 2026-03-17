# A way better Ngrok GraphQL web interface
The default ngrok web interface sucks for GraphQL. Everything is `POST /graphql` with no extra info.

This vite-based react UI shows you to

1. Filter on request types 
2. Search / filter requests 🔎
3. Shows request variables in overview
4. Allows deep introspection 
5. Allows tapping json values to copy to inbox ⚡️
6. Allows replaying requests 

And more - in a 20x for a 10x more streamlined experience

100% vibe coded.

## Getting started

1. Git clone this repository
2. `npm run dev` and navigate to `localhost:5731`

You probably want to add this to any alias you use for booting up ngrok or otherwise.

E.g. `alias -g dngrok="cd ~/Development/ngrok-graphql-web-interface && npm run dev"`

## Example

<img width="888" height="839" alt="image" src="https://github.com/user-attachments/assets/9c3c5896-5585-40ba-ad15-b9df92bc3db8" />






