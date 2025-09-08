#!/bin/bash

# AI编程学习平台部署脚本
# 使用方法: ./scripts/deploy.sh [环境] [操作]
# 例如: ./scripts/deploy.sh production up

set -e  # 遇到错误立即退出

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 打印函数
print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 检查命令是否存在
check_command() {
    if ! command -v $1 &> /dev/null; then
        print_error "$1 命令未找到，请先安装"
        exit 1
    fi
}

# 检查环境变量文件
check_env_file() {
    if [ ! -f .env ]; then
        print_warning ".env 文件不存在，从 .env.example 复制"
        cp .env.example .env
        print_info "请编辑 .env 文件配置必要的环境变量"
        return 1
    fi
    return 0
}

# 创建必要的目录
create_directories() {
    print_info "创建必要的目录..."
    mkdir -p server/uploads
    mkdir -p server/logs
    mkdir -p nginx/logs
    mkdir -p ssl
    print_success "目录创建完成"
}

# 构建前端应用
build_frontend() {
    print_info "构建前端应用..."
    cd client
    if [ ! -d "node_modules" ]; then
        print_info "安装前端依赖..."
        npm install
    fi
    npm run build
    cd ..
    print_success "前端构建完成"
}

# 部署开发环境
deploy_development() {
    print_info "部署开发环境..."
    
    # 检查并创建网络
    if ! docker network ls | grep -q "ai-coding-dev-network"; then
        docker network create ai-coding-dev-network
        print_info "创建开发网络完成"
    fi
    
    # 启动服务
    docker-compose -f docker-compose.dev.yml up -d
    
    print_success "开发环境部署完成！"
    print_info "前端地址: http://localhost:3000"
    print_info "后端地址: http://localhost:5000"
    print_info "MongoDB: localhost:27017"
    print_info "Redis: localhost:6379"
}

# 部署生产环境
deploy_production() {
    print_info "部署生产环境..."
    
    # 构建前端
    build_frontend
    
    # 构建Docker镜像
    print_info "构建Docker镜像..."
    docker-compose build --no-cache
    
    # 启动服务
    print_info "启动生产服务..."
    docker-compose up -d
    
    # 等待服务启动
    print_info "等待服务启动..."
    sleep 30
    
    # 健康检查
    print_info "执行健康检查..."
    if curl -f http://localhost:5000/api/health > /dev/null 2>&1; then
        print_success "后端服务健康检查通过"
    else
        print_error "后端服务健康检查失败"
        return 1
    fi
    
    print_success "生产环境部署完成！"
    print_info "应用地址: http://localhost"
    print_info "API地址: http://localhost/api"
}

# 停止服务
stop_services() {
    local env=${1:-development}
    
    print_info "停止 $env 环境服务..."
    
    if [ "$env" = "production" ]; then
        docker-compose down
    else
        docker-compose -f docker-compose.dev.yml down
    fi
    
    print_success "$env 环境服务已停止"
}

# 重启服务
restart_services() {
    local env=${1:-development}
    
    print_info "重启 $env 环境服务..."
    
    stop_services $env
    sleep 5
    
    if [ "$env" = "production" ]; then
        deploy_production
    else
        deploy_development
    fi
}

# 查看服务状态
show_status() {
    local env=${1:-development}
    
    print_info "查看 $env 环境服务状态..."
    
    if [ "$env" = "production" ]; then
        docker-compose ps
    else
        docker-compose -f docker-compose.dev.yml ps
    fi
}

# 查看日志
show_logs() {
    local env=${1:-development}
    local service=${2:-}
    
    print_info "查看 $env 环境日志..."
    
    if [ "$env" = "production" ]; then
        if [ -n "$service" ]; then
            docker-compose logs -f $service
        else
            docker-compose logs -f
        fi
    else
        if [ -n "$service" ]; then
            docker-compose -f docker-compose.dev.yml logs -f $service
        else
            docker-compose -f docker-compose.dev.yml logs -f
        fi
    fi
}

# 清理资源
cleanup() {
    print_info "清理Docker资源..."
    
    # 停止并删除容器
    docker-compose down --remove-orphans
    docker-compose -f docker-compose.dev.yml down --remove-orphans
    
    # 清理未使用的镜像
    docker image prune -f
    
    # 清理未使用的卷（谨慎使用）
    read -p "是否清理未使用的数据卷？这将删除数据库数据 (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        docker volume prune -f
        print_warning "数据卷已清理"
    fi
    
    print_success "清理完成"
}

# 备份数据
backup_data() {
    local backup_dir="backups/$(date +%Y%m%d_%H%M%S)"
    
    print_info "备份数据到 $backup_dir..."
    mkdir -p $backup_dir
    
    # 备份MongoDB
    docker exec ai-coding-mongodb mongodump --out /tmp/backup
    docker cp ai-coding-mongodb:/tmp/backup $backup_dir/mongodb
    
    # 备份上传文件
    if [ -d "server/uploads" ]; then
        cp -r server/uploads $backup_dir/
    fi
    
    # 备份配置文件
    cp .env $backup_dir/
    
    print_success "数据备份完成: $backup_dir"
}

# 显示帮助信息
show_help() {
    echo "AI编程学习平台部署脚本"
    echo ""
    echo "用法:"
    echo "  ./scripts/deploy.sh [环境] [操作]"
    echo ""
    echo "环境:"
    echo "  development  开发环境 (默认)"
    echo "  production   生产环境"
    echo ""
    echo "操作:"
    echo "  up          启动服务"
    echo "  down        停止服务"
    echo "  restart     重启服务"
    echo "  status      查看状态"
    echo "  logs        查看日志"
    echo "  build       构建应用"
    echo "  backup      备份数据"
    echo "  cleanup     清理资源"
    echo "  help        显示帮助"
    echo ""
    echo "示例:"
    echo "  ./scripts/deploy.sh development up"
    echo "  ./scripts/deploy.sh production restart"
    echo "  ./scripts/deploy.sh development logs backend-dev"
}

# 主函数
main() {
    local env=${1:-development}
    local action=${2:-up}
    
    # 检查必要的命令
    check_command "docker"
    check_command "docker-compose"
    
    # 创建必要的目录
    create_directories
    
    case $action in
        up|start)
            if ! check_env_file && [ "$env" = "production" ]; then
                exit 1
            fi
            
            if [ "$env" = "production" ]; then
                deploy_production
            else
                deploy_development
            fi
            ;;
        down|stop)
            stop_services $env
            ;;
        restart)
            restart_services $env
            ;;
        status|ps)
            show_status $env
            ;;
        logs)
            show_logs $env $3
            ;;
        build)
            if [ "$env" = "production" ]; then
                build_frontend
                docker-compose build
            else
                print_info "开发环境自动构建，无需手动构建"
            fi
            ;;
        backup)
            backup_data
            ;;
        cleanup)
            cleanup
            ;;
        help|--help|-h)
            show_help
            ;;
        *)
            print_error "未知操作: $action"
            show_help
            exit 1
            ;;
    esac
}

# 确保脚本从项目根目录运行
if [ ! -f "package.json" ]; then
    print_error "请从项目根目录运行此脚本"
    exit 1
fi

# 运行主函数
main "$@"