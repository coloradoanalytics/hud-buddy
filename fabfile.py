from fabric.api import env, run, cd, sudo

PYTHON = '~/Envs/hudl/bin/python3'
PIP = '~/Envs/hudl/bin/pip3'

env.hosts = ['hudl.coloradoanalytics.com']
env.user = 'hudl'


def deploy():
    """
    Command to deploy the application. Pulls the latest
    master from GitHub, install missing requirements,
    and restarts nginx and the application itself.
    """
    with cd('hudbuddy'):
        run('git pull')
        run(PIP + ' install -r requirements.txt')
        sudo('systemctl restart hudl')
        sudo('service nginx reload')
