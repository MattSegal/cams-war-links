"""
Selenium Regression tests for Links

Requires ChromeDriver download from https://sites.google.com/a/chromium.org/chromedriver/home

We can run these tests in parallel with pytest-xdist
Eg,
    py.test.\test_ui.py -v -n 3
where n is the number of cores to use
"""

import time

from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.common.exceptions import NoSuchElementException

import links_api

def test_create_user():
    """ Create a user via the UI
    """
    test_user_name = "testuser1"

    driver = webdriver.Chrome()
    driver.implicitly_wait(2) # seconds
    driver.get("http://localhost:5000/links")

    # Navigate to user page
    driver.find_element_by_id("edit-users-button").click()
    assert check_exists_by_id(driver,"user-page")
    
    # Create user
    driver.find_element_by_id("new-user-button").click()
    driver.find_element_by_id("new-user-name").send_keys(test_user_name)
    driver.find_element_by_id("confirm-new-user-button").click()

    navbar_id   = "select"+test_user_name.title()
    edit_id     = "edit"+test_user_name.title()
    delete_id   = "delete"+test_user_name.title()
    
    assert check_exists_by_id(driver,navbar_id)
    assert check_exists_by_id(driver,edit_id)
    assert check_exists_by_id(driver,delete_id)

    driver.close()

    # Teardown
    links_api.delete_user(test_user_name)


def test_delete_user():
    """ Delete a user via the UI
    """
    test_user_name = "testuser2"

    # Setup
    links_api.create_user(test_user_name)

    driver = webdriver.Chrome()
    driver.implicitly_wait(2) # seconds
    driver.get("http://localhost:5000/links")

    navbar_id   = "select"+test_user_name.title()
    edit_id     = "edit"+test_user_name.title()
    delete_id   = "delete"+test_user_name.title()

    # Navigate to user page
    driver.find_element_by_id("edit-users-button").click()
    assert check_exists_by_id(driver,"user-page")
    assert check_exists_by_id(driver,navbar_id)
    assert check_exists_by_id(driver,edit_id)
    assert check_exists_by_id(driver,delete_id)

    # Delete user
    driver.find_element_by_id(delete_id).click()
    driver.find_element_by_id(delete_id).click()
    time.sleep(1) # wait for animation
    
    assert not check_exists_by_id(driver,navbar_id)
    assert not check_exists_by_id(driver,edit_id)
    assert not check_exists_by_id(driver,delete_id)

    driver.close()

def check_exists_by_id(driver,id):
    try:
        driver.find_element_by_id(id)
    except NoSuchElementException:
        return False
    return True
