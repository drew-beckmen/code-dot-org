Feature: Course versions

@as_student
@no_mobile
Scenario: Version warning announcement on course and unit overview pages
  # course and unit pages do not show version warning initially

  When I am on "http://studio.code.org/courses/csp-2017"
  And I wait to see ".uitest-CourseScript"
  And element "#version-selector" is visible
  Then element ".announcement-notification:contains(right version)" does not exist

  When I am on "http://studio.code.org/s/csp2"
  And I wait until element "span:contains(Chapter 1)" is visible
  Then element ".announcement-notification:contains(right version)" does not exist

  # generate some progress in csp-2018

  Given I am on "http://studio.code.org/s/csp3-2018/next"
  And I wait until current URL contains "/s/csp3-2018/stage/1/puzzle/1"

  # course and unit pages now show version warning

  When I am on "http://studio.code.org/courses/csp-2017"
  And I wait to see ".uitest-CourseScript"
  And element "#version-selector" is visible
  Then element ".announcement-notification:contains(right version)" is visible
  # make sure we are showing the warning specific to course overview pages
  Then element ".announcement-notification:contains(use the version dropdown)" is visible

  When I am on "http://studio.code.org/s/csp2"
  And I wait until element "span:contains(Chapter 1)" is visible
  Then element ".announcement-notification:contains(right version)" is visible
  # make sure we are showing the warning specific to course units
  Then element ".announcement-notification:contains(go back to the course page)" is visible


