dev:
	docker compose up & \
	ngrok http --domain=pleasing-bluebird-randomly.ngrok-free.app 5678 & \
	wait
import-workflow:
	docker compose exec n8n n8n import:workflow --separate --input=/home/node/workflows/
export-workflow:
	docker compose exec n8n n8n export:workflow --all --separate --output=/home/node/workflows/
export-cre:
	docker compose exec n8n n8n export:credentials --all --output=/home/node/workflows/credentials.json
import-cre:
	docker compose exec n8n n8n import:credentials --input=/home/node/workflows/credentials.json
dashboard-dev:
	cd dashboard && npm run dev
dashboard-build:
	cd dashboard && npm run build
dashboard-install:
	cd dashboard && npm install
logs:
	docker compose logs -f --tail=100
restart:
	docker compose restart
