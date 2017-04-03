Feature: More advanced feature

  Background:
    Given I'm running a simple test

  Scenario Outline: Test a few things
    When I pass a parameter like <fruit>
    And I do an <type> step
    And I pass a parameter like <type>
    Then I should see some results

    Examples:
      | fruit    | type       |
      | "apple"  | "undefined" |
      | "orange" | "defined"   |
