from django.test import TestCase
from django.test.client import Client


class BasicViewTest(TestCase):
    def setUp(self):
        self.c = Client()

    def test_root(self):
        response = self.c.get("/")
        self.assertEqual(response.status_code, 200)

    def test_smoketest(self):
        response = self.c.get("/smoketest/")
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "PASS")

    def test_glacier(self):
        response = self.c.get("/glacier/")
        self.assertEqual(response.status_code, 200)
        self.assertTrue('main/glacier.html'
                        in [t.name for t in response.templates])

    def test_water(self):
        response = self.c.get("/water/")
        self.assertEqual(response.status_code, 200)
        self.assertTrue('main/water.html'
                        in [t.name for t in response.templates])

    def test_gallery(self):
        response = self.c.get("/gallery/antarctica/")
        self.assertEqual(response.status_code, 200)
        self.assertTrue('main/gallery.html'
                        in [t.name for t in response.templates])
        self.assertContains(response, 'Gallery')

    def test_gallery_nonexistant(self):
        response = self.c.get("/gallery/doesnotexist/")
        self.assertEqual(response.status_code, 200)
        self.assertTrue('main/gallery.html'
                        in [t.name for t in response.templates])
