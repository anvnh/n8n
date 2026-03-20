dev:
	docker compose up & \
	ngrok http --domain=pleasing-bluebird-randomly.ngrok-free.app 5678 & \
	wait
