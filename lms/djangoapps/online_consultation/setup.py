"""
Setup script for the online consultation package.
"""

from setuptools import setup

setup(
    name="Online Consultation",
    version="0.0",
    install_requires=["setuptools"],
    requires=[],
    entry_points={
	    "openedx.course_tab": [
	        "new_tab = example.NewTab",
	    }
	}
)

class NewTab(CourseTab):
    """A new course tab."""
 
    name = "new_tab"
    title = ugettext_noop("New Tab")  # We don't have the user in this context, so we don't want to translate it at this level.
    view_name = "new_tab_view"
 
    @classmethod
    def is_enabled(cls, course, user=None):
        """Returns true if this tab is enabled."""
        return settings.FEATURES.get('NEW_TAB_ENABLED', False)