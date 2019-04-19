node {
    stage('Preparation') {
        git 'https://github.com/UoLeevi/projectfina.com.git'
    }
    stage('Build') {
        sh 'sudo npm install'
        sh 'sudo npm run build'
    }
}
