"""
Selenium Regression tests for Links

Requires ChromeDriver download from https://sites.google.com/a/chromium.org/chromedriver/home

We can run these tests in parallel with pytest-xdist
Eg,
    py.test .\test_ui.py -v -n 3
where n is the number of cores to use
"""

import time

from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.common.exceptions import NoSuchElementException

import links_api
from test_helpers import TestData

LINKS_URL = "http://localhost:5000/links"
LINKS_URL = "http://mattdsegal.com/links"

def test_create_link():
    """ Create a link via the UI
    """
    data = TestData()

    # Setup
    print "Setup"
    print "\tcreate user {0}".format(data.username)
    links_api.create_user(data.username,base_url=LINKS_URL)

    print "\topen page"
    driver = webdriver.Chrome()
    driver.implicitly_wait(2) # seconds
    driver.get(LINKS_URL)

    print "Test"
    navbar_id   = "select"+data.username

    # Navigate to links page
    print "\tFind and click {0}".format(navbar_id)
    driver.find_element_by_id(navbar_id).click()
    assert check_exists_by_id(driver,"link-page")    

    # Create new link
    new_item_button = driver.find_element_by_id("new-item-button")
    new_item_form   = driver.find_element_by_xpath("//div[@id='new-item-form']")
    url_input       = new_item_form.find_element_by_xpath("./div[@id='new-item-form-fields']/input[@class='url']")
    title_input     = new_item_form.find_element_by_xpath("./div[@id='new-item-form-fields']/input[@class='title']")
    submit_btn      = new_item_form.find_element_by_xpath("./div[@id='new-item-form-buttons']/button[@class='submit']")

    new_item_button.click()
    title_input.send_keys(data.link_title)
    url_input.send_keys(data.link_url)
    submit_btn.click()

    newest_link_container = driver.find_element_by_xpath("//div[@id='link-list']/*[1]")
    newest_link = newest_link_container.find_element_by_xpath("./div/a")
    link_name = newest_link.text
    link_href = newest_link.get_attribute('href')

    assert link_name == data.link_title
    assert link_href == data.link_url

    # Teardown
    print "Teardown"
    print "\tdelete user {0}".format(data.username)
    links_api.delete_user(data.username,base_url=LINKS_URL)
    print "\tquit browser"
    driver.quit()

def test_create_user():
    """ Create a user via the UI
    """
    test_user_name = get_test_username()

    driver = webdriver.Chrome()
    driver.implicitly_wait(2) # seconds
    driver.get(LINKS_URL)

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
    links_api.delete_user(test_user_name,base_url=LINKS_URL)

def test_delete_user():
    """ Delete a user via the UI
    """
    test_user_name = get_test_username()

    # Setup
    links_api.create_user(test_user_name,base_url=LINKS_URL)

    driver = webdriver.Chrome()
    driver.implicitly_wait(2) # seconds
    driver.get(LINKS_URL)

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

