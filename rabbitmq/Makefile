.PHONY: deploy ship

deploy:
	envsubst < k8s/deployment.yml | kubectl apply -n espresso-machine -f -

undeploy:
	envsubst < k8s/deployment.yml | kubectl delete -n espresso-machine -f -

ship: deploy
