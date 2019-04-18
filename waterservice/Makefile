.PHONY: install serve clean pack deploy ship

TAG?=$(shell git rev-list HEAD --max-count=1 --abbrev-commit)

export TAG

install:
	./mvnw clean compile

serve:
	./mvnw clean compile quarkus:dev

clean:
	./mvnw clean

native:
	./mvnw package -Pnative -Dnative-image.docker-build=true

pack: native
	docker build -t noctarius2k/waterservice:$(TAG) -f src/main/docker/Dockerfile.native .

upload:
	docker push noctarius2k/waterservice:$(TAG)

deploy:
	envsubst < k8s/deployment.yml | kubectl apply -n espresso-machine -f -

undeploy:
	envsubst < k8s/deployment.yml | kubectl delete -n espresso-machine -f -

ship: pack upload deploy
