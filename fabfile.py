from fabric.api import env, run, cd, sudo

env.hosts = ['hudl.coloradoanalytics.com']
env.user = 'hudl'


def deploy():
    with cd('hudbuddy'):
        run('git pull')
        sudo('systemctl restart hudl')
        sudo('service nginx reload')
