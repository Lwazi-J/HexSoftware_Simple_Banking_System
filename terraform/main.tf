terraform {
  required_providers {
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = ">= 2.0.0"
    }
    helm = {
      source  = "hashicorp/helm"
      version = ">= 2.0.0"
    }
  }
}

provider "kubernetes" {
  config_path = "~/.kube/config"
}

provider "helm" {
  kubernetes {
    config_path = "~/.kube/config"
  }
}

resource "kubernetes_namespace" "banking" {
  metadata {
    name = var.namespace
  }
}

# MySQL Deployment
resource "kubernetes_secret" "mysql" {
  metadata {
    name      = "mysql-secrets"
    namespace = kubernetes_namespace.banking.metadata[0].name
  }

  data = {
    "MYSQL_ROOT_PASSWORD" = var.mysql_root_password
    "MYSQL_DATABASE"      = var.mysql_database
  }
}

resource "kubernetes_persistent_volume_claim" "mysql" {
  metadata {
    name      = "mysql-pvc"
    namespace = kubernetes_namespace.banking.metadata[0].name
  }
  spec {
    access_modes = ["ReadWriteOnce"]
    resources {
      requests = {
        storage = "1Gi"
      }
    }
  }
}

resource "kubernetes_deployment" "mysql" {
  metadata {
    name      = "mysql"
    namespace = kubernetes_namespace.banking.metadata[0].name
    labels = {
      app = "mysql"
    }
  }

  spec {
    replicas = 1
    selector {
      match_labels = {
        app = "mysql"
      }
    }

    template {
      metadata {
        labels = {
          app = "mysql"
        }
      }

      spec {
        container {
          name  = "mysql"
          image = "mysql:8.0"
          env_from {
            secret_ref {
              name = kubernetes_secret.mysql.metadata[0].name
            }
          }
          port {
            container_port = 3306
          }
          volume_mount {
            name       = "mysql-persistent-storage"
            mount_path = "/var/lib/mysql"
          }
        }
        volume {
          name = "mysql-persistent-storage"
          persistent_volume_claim {
            claim_name = kubernetes_persistent_volume_claim.mysql.metadata[0].name
          }
        }
      }
    }
  }
}

resource "kubernetes_service" "mysql" {
  metadata {
    name      = "mysql"
    namespace = kubernetes_namespace.banking.metadata[0].name
  }
  spec {
    selector = {
      app = kubernetes_deployment.mysql.spec.0.template.0.metadata.0.labels.app
    }
    port {
      port        = 3306
      target_port = 3306
    }
  }
}

# Backend Deployment
resource "kubernetes_deployment" "backend" {
  metadata {
    name      = "backend"
    namespace = kubernetes_namespace.banking.metadata[0].name
    labels = {
      app = "backend"
    }
  }

  spec {
    replicas = 1
    selector {
      match_labels = {
        app = "backend"
      }
    }

    template {
      metadata {
        labels = {
          app = "backend"
        }
      }

      spec {
        container {
          name  = "backend"
          image = "${var.docker_username}/banking-backend:latest"
          env {
            name  = "SPRING_DATASOURCE_URL"
            value = "jdbc:mysql://mysql.${kubernetes_namespace.banking.metadata[0].name}.svc.cluster.local:3306/${var.mysql_database}"
          }
          env {
            name  = "SPRING_DATASOURCE_USERNAME"
            value = "root"
          }
          env {
            name  = "SPRING_DATASOURCE_PASSWORD"
            value = var.mysql_root_password
          }
          port {
            container_port = 8080
          }
        }
      }
    }
  }
}

resource "kubernetes_service" "backend" {
  metadata {
    name      = "backend"
    namespace = kubernetes_namespace.banking.metadata[0].name
  }
  spec {
    selector = {
      app = kubernetes_deployment.backend.spec.0.template.0.metadata.0.labels.app
    }
    port {
      port        = 8080
      target_port = 8080
    }
  }
}

# Frontend Deployment
resource "kubernetes_deployment" "frontend" {
  metadata {
    name      = "frontend"
    namespace = kubernetes_namespace.banking.metadata[0].name
    labels = {
      app = "frontend"
    }
  }

  spec {
    replicas = 1
    selector {
      match_labels = {
        app = "frontend"
      }
    }

    template {
      metadata {
        labels = {
          app = "frontend"
        }
      }

      spec {
        container {
          name  = "frontend"
          image = "${var.docker_username}/banking-frontend:latest"
          port {
            container_port = 80
          }
        }
      }
    }
  }
}

resource "kubernetes_service" "frontend" {
  metadata {
    name      = "frontend"
    namespace = kubernetes_namespace.banking.metadata[0].name
  }
  spec {
    selector = {
      app = kubernetes_deployment.frontend.spec.0.template.0.metadata.0.labels.app
    }
    port {
      port        = 80
      target_port = 80
    }
    type = "NodePort"
  }
}

# Ingress Configuration
resource "kubernetes_ingress_v1" "banking" {
  metadata {
    name      = "banking-ingress"
    namespace = kubernetes_namespace.banking.metadata[0].name
    annotations = {
      "nginx.ingress.kubernetes.io/rewrite-target" = "/"
    }
  }

  spec {
    ingress_class_name = "nginx"
    rule {
      http {
        path {
          path = "/"
          backend {
            service {
              name = kubernetes_service.frontend.metadata[0].name
              port {
                number = 80
              }
            }
          }
        }
        path {
          path = "/api"
          backend {
            service {
              name = kubernetes_service.backend.metadata[0].name
              port {
                number = 8080
              }
            }
          }
        }
      }
    }
  }
}