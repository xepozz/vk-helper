init: file-ready-create docker-down docker-pull docker-build docker-up file-ready-delete run-app-makefile
bcp: build-prod commit-build deploy

run-app-makefile:
#	cd app && make init

docker-up:
	docker-compose up -d

docker-pull:
	docker-compose pull

docker-down:
	docker-compose down --remove-orphans

docker-build:
	docker-compose build

file-ready-delete:
	docker run --rm -v ${PWD}/app:/var/www/app --workdir=/var/www/app alpine rm -f /tmp/.ready
file-ready-create:
	docker run --rm -v ${PWD}/app:/var/www/app --workdir=/var/www/app alpine touch -f /tmp/.ready

commit-build:
	git add app/build && git commit -m "Build"

build:
	docker-compose run --rm app-node-cli npm run dev
	sudo chown ${USER}:root app/build/ -R

build-prod:
	docker-compose run --rm app-node-cli npm run prod
	sudo chown ${USER}:root app/build/ -R

watch:
	docker-compose run --rm app-node-cli npm run watch
	sudo chown ${USER}:root app/build/ -R

deploy:
	git subtree push --prefix app/build origin gh-pages

vendor-reinstall:
	docker-compose run --rm app-node-cli rm -rf node_modules package-lock.json
	docker-compose run --rm app-node-cli npm install