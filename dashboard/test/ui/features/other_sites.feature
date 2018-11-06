@eyes
Feature: Looking at other Pegasus sites with Applitools Eyes

Scenario Outline: Simple page view
  When I open my eyes to test "<test_name>"
  And I am on "<url>"
  When I rotate to landscape
  Then I see no difference for "initial load"
  And I close my eyes
  And I sign out
Examples:
  | url                                                               | test_name                  |
  | http://advocacy.code.org/                                         | advocacy.code.org home     |
  | http://csedweek.org/                                              | csedweek.org home          |
  | http://csedweek.org/about                                         | csedweek.org about         |
  | http://code.org/curriculum/unplugged                              | code.org curriculum        |
  | http://code.org/minecraft                                         | minecraft tutorial landing |
  | http://code.org/dance                                             | dance tutorial landing     |
  | http://code.org/playlab                                           | playlab tutorial landing   |
  | http://code.org/starwars                                          | starwars tutorial landing  |
  | http://code.org/athletes                                          | athletes tutorial landing  |
  | http://code.org/educate/applab                                    | app lab tutorial landing   |
