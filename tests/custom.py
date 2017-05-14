from collections import Counter
import unittest


class CustomTestCase(unittest.TestCase):

    def assertListsEqual(self, l1, l2):
        """
        Convenience method for asserting that the contents
        of two lists are the same, regardless of order.
        """
        self.assertEqual(Counter(l1), Counter(l2))
