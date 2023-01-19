env:
	@bash setup/env.sh

up:
	docker compose -f docker-compose.yml up

down:
	docker compose -f docker-compose.yml down

prune:
	docker system prune -af --volumes --force
