<?php

require 'vendor/autoload.php';

use Alfred\Workflows\Workflow;

$workflow = new Workflow;

class CodeRunner
{
    private $workflow;

    public function __construct()
    {
        $this->workflow = new Workflow;
    }

    public function execute($code)
    {
        $isSuccess = true;

        $startTime = microtime(true);
        $code = $this->transformCode($code);

        try {
            $result = @eval($code);
        } catch(\ParseError $e) {
            $isSuccess = false;
            $result = $e->getMessage();
        } catch(\Error $e) {
            $isSuccess = false;
            $result = $e->getMessage();
        }
        $duration = round(microtime(true) - $startTime, 4);

        $subtitle = 'Copy to Clipboard  |  ' . $duration . ' seconds';

        $error = error_get_last();
        if ($error != NULL) {
            $isSuccess = false;
            $result = $error['message'];
        }

        if ($result == null) {
            $result = 'No results';
            $subtitle = '';
        }

        $workflowResult = $this->workflow->result()
                        ->title($result)
                        ->subtitle($subtitle)
                        ->valid(true)
                        ->icon($icon);

        if ($isSuccess) {
            $workflowResult->text('copy', $result)
                                ->icon('/System/Library/CoreServices/CoreTypes.bundle/Contents/Resources/GenericApplicationIcon.icns')
                                ->arg($result);
        } else {
            $workflowResult->icon('/System/Library/CoreServices/CoreTypes.bundle/Contents/Resources/AlertStopIcon.icns');
        }

        return $this->workflow->output();
    }

    public function transformCode($code) {
        if (substr($code, 0, 7) != 'return ') {
            $code = 'return ' . $code;
        }
        if (substr($code, -1) != ';') {
            $code .= ';';
        }

        return $code;
    }
}