Feature: More advanced feature

  Background:
    Given I'm running a simple test

  Scenario Outline: Test a few things
    When I pass a parameter like <fruit>
    Then I should see some results

    Examples:
      | fruit    |
      | "apple"  |
      | "orange" |
