output "frontend_url" {
  value = "http://$(minikube ip)"
}

output "backend_url" {
  value = "http://$(minikube ip)/api"
}

output "mysql_service" {
  value = "mysql.${var.namespace}.svc.cluster.local"
}