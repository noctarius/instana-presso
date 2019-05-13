.PHONY: install serve clean pack deploy ship

TAG?=$(shell git rev-list HEAD --max-count=1 --abbrev-commit)

export TAG

install:
	./mvnw package

clean:
	rm -rf target

pack: 
	docker build -t gcr.io/acquired-rarity-236416/waterservice:$(TAG) .

upload:
	docker push gcr.io/acquired-rarity-236416/waterservice:$(TAG)

deploy:
	envsubst < k8s/deployment.yml | kubectl apply -n espresso-machine -f -

undeploy:
	envsubst < k8s/deployment.yml | kubectl delete -n espresso-machine -f -

ship: pack upload deploy
