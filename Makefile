import-workflow:
	docker compose exec n8n n8n import:workflow --separate --input=/home/node/workflows/
export-workflow:
	docker compose exec n8n n8n export:workflow --all --separate --output=/home/node/workflows/
logs:
	docker compose logs -f --tail=100
restart:
	docker compose restart
