variable "docker_username" {
  description = "Docker Hub username"
  type        = string
}

variable "docker_password" {
  description = "Docker Hub password"
  type        = string
  sensitive   = true
}

variable "mysql_root_password" {
  description = "MySQL root password"
  type        = string
  sensitive   = true
  default     = "1234"
}

variable "mysql_database" {
  description = "MySQL database name"
  type        = string
  default     = "banking_system"
}

variable "namespace" {
  description = "Kubernetes namespace"
  type        = string
  default     = "banking-system"
}