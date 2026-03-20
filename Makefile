dev:
	docker compose up & \
	ngrok http --domain=pleasing-bluebird-randomly.ngrok-free.app 5678 & \
	wait
import-workflow:
	docker exec -it n8n-n8n-1 n8n import:workflow --separate --input=/home/node/workflows/
export-workflow:
	docker exec -it n8n-n8n-1 n8n export:workflow --all --separate --output=/home/node/workflows/
