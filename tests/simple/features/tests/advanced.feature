Feature: More advanced feature

  Background:
    Given I'm running a simple test

  Scenario Outline: Test a few things
    When I pass a parameter like <fruit>
    And I do an <type> step
    And I pass a parameter like <type>
    And I pass multiple parameters like <type> and <fruit>
    Then I should see some results

    Examples:
      | fruit    | type        |
      | "apple"  | "undefined" |
      | "orange" | "defined"   |

  Scenario: This is the same scenario
  This is the scenario description
    Given I'm running a simple test
    When I pass a parameter like "<strong>banana</strong>"
    Then I should see some results
