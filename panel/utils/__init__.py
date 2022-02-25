from transitions import Machine


class PzServerStateMachine(object):
    states = ['off', 'booting', 'on', 'halting']

    def __init__(self):
        self.machine = Machine(model=self, states=PzServerStateMachine.states, initial='off')

        self.machine.add_transition(trigger='boot', source='off', dest='booting')
        self.machine.add_transition(trigger='on', source='*', dest='on')
        self.machine.add_transition(trigger='halt', source=['booting', 'on'], dest='halting')
        self.machine.add_transition(trigger='off', source='*', dest='off')
