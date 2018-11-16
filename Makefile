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
	docker build -t noctarius2k/waterservice:$(TAG) .

upload:
	docker push noctarius2k/waterservice:$(TAG)

deploy:
	envsubst < k8s/deployment.yml | kubectl apply -n espresso-machine -f -

undeploy:
	envsubst < k8s/deployment.yml | kubectl delete -n espresso-machine -f -

ship: pack upload deploy clean
