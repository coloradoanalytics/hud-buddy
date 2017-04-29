from collections import Counter
import unittest


class CustomTestCase(unittest.TestCase):

    def assertListsEqual(self, l1, l2):
        self.assertEqual(Counter(l1), Counter(l2))
