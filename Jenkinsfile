node {
    stage('Preparation') {
        git 'https://github.com/UoLeevi/projectfina.git'
    }
    stage('Build') {
        sh 'npm install'
        sh 'sudo npm run build'
    }
}
