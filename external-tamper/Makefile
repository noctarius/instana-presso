.PHONY: install serve clean pack deploy ship

TAG?=$(shell git rev-list HEAD --max-count=1 --abbrev-commit)

export TAG

install:
	npm install

serve: install
	npm start

clean:
	rm -rf node_modules

pack: 
	docker build -t gcr.io/acquired-rarity-236416/tamper:$(TAG) .

upload:
	docker push gcr.io/acquired-rarity-236416/tamper:$(TAG)

deploy:
	envsubst < k8s/deployment.yml | kubectl apply -n external -f -

undeploy:
	envsubst < k8s/deployment.yml | kubectl delete -n external -f -

ship: pack upload deploy clean
